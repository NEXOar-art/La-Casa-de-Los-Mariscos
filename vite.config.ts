import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import JSZip from 'jszip';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

function addDirectoryToZip(
  zip: JSZip,
  rootDir: string,
  relDir: string,
  ignoreNames: Set<string>
): void {
  const fullDir = path.join(rootDir, relDir);
  if (!fs.existsSync(fullDir)) return;

  for (const entry of fs.readdirSync(fullDir, {withFileTypes: true})) {
    if (ignoreNames.has(entry.name)) continue;
    const relPath = relDir ? `${relDir}/${entry.name}` : entry.name;
    const fullPath = path.join(rootDir, relPath);

    if (entry.isDirectory()) {
      addDirectoryToZip(zip, rootDir, relPath, ignoreNames);
    } else if (entry.isFile()) {
      zip.file(relPath, fs.readFileSync(fullPath));
    }
  }
}

function projectZipPlugin(): Plugin {
  const handler = async (
    req: {url?: string; method?: string},
    res: {
      statusCode: number;
      setHeader: (name: string, value: string) => void;
      end: (chunk?: Uint8Array | string) => void;
    },
    next: () => void
  ) => {
    const cleanUrl = (req.url || '').split('?')[0];
    if (!cleanUrl.endsWith('/__export-project.zip')) {
      next();
      return;
    }

    if (req.method === 'HEAD') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/zip');
      res.end();
      return;
    }

    try {
      const rootDir = path.resolve(__dirname);
      const zip = new JSZip();
      const ignoreNames = new Set(['node_modules', '.git', '.DS_Store']);
      addDirectoryToZip(zip, rootDir, '', ignoreNames);

      const buffer = await zip.generateAsync({
        type: 'uint8array',
        compression: 'DEFLATE',
        compressionOptions: {level: 6},
      });

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="la-casa-de-los-mariscos-completo.zip"'
      );
      res.setHeader('Content-Length', String(buffer.byteLength));
      res.end(buffer);
    } catch {
      res.statusCode = 500;
      res.end('Error generating zip');
    }
  };

  return {
    name: 'project-zip-exporter',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig(() => {
  const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
  const base =
    process.env.GITHUB_ACTIONS && repoName ? `/${repoName}/` : './';

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      projectZipPlugin(),
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
