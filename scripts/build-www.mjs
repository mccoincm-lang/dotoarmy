// Builds an offline copy of the game into android/app/src/main/assets/www:
// three.js, post-processing and fonts are bundled locally (no CDN needed at runtime).
import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.join(root, 'android/app/src/main/assets/www');
fs.rmSync(out, {recursive: true, force: true}); fs.mkdirSync(path.join(out, 'lib/fonts'), {recursive: true});
const cp = (a, b) => { fs.mkdirSync(path.dirname(b), {recursive: true}); fs.cpSync(a, b, {recursive: true}); };
cp(path.join(root, 'web/logo.png'), path.join(out, 'logo.png'));
cp(path.join(root, 'web/hero.png'), path.join(out, 'hero.png'));
cp(path.join(root, 'web/shop'), path.join(out, 'shop'));
const nm = p => path.join(root, 'node_modules', p);
const libs = {
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js': 'three/build/three.min.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/CopyShader.js': 'three/examples/js/shaders/CopyShader.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/LuminosityHighPassShader.js': 'three/examples/js/shaders/LuminosityHighPassShader.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/EffectComposer.js': 'three/examples/js/postprocessing/EffectComposer.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/RenderPass.js': 'three/examples/js/postprocessing/RenderPass.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/ShaderPass.js': 'three/examples/js/postprocessing/ShaderPass.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/UnrealBloomPass.js': 'three/examples/js/postprocessing/UnrealBloomPass.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/utils/BufferGeometryUtils.js': 'three/examples/js/utils/BufferGeometryUtils.js',
};
let html = fs.readFileSync(path.join(root, 'web/index.html'), 'utf8');
for (const [url, rel] of Object.entries(libs)) {
  if (!html.includes(url)) throw new Error('missing script tag for ' + url);
  const dest = 'lib/' + path.basename(rel); cp(nm(rel), path.join(out, dest)); html = html.replace(url, dest);
}
// fonts
const fonts = [['@fontsource/vazirmatn', ['400', '500', '700', '800', '900']], ['@fontsource/chakra-petch', ['600', '700']]];
const links = [];
for (const [pkg, ws] of fonts) {
  const name = pkg.split('/')[1]; cp(nm(pkg + '/files'), path.join(out, 'lib/fonts', name, 'files'));
  for (const w of ws) { cp(nm(pkg + '/' + w + '.css'), path.join(out, 'lib/fonts', name, w + '.css')); links.push(`<link rel="stylesheet" href="lib/fonts/${name}/${w}.css">`); }
}
html = html.replace(/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\s*/, '')
           .replace(/<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>\s*/, '')
           .replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com\/css2[^"]*">/, links.join('\n'));
if (/https:\/\/(cdn|fonts)\./.test(html)) throw new Error('remote reference left in html');
const head = '<!doctype html>\n<html lang="fa">\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">\n<meta name="theme-color" content="#0a0e0c">\n';
fs.writeFileSync(path.join(out, 'index.html'), head + html);
console.log('www built:', out);
