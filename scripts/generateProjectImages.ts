import fs from 'fs';
import path from 'path';

const projectsDir = path.join(process.cwd(), 'public/images/projects');
const projects = fs.readdirSync(projectsDir);

const projectImages: Record<string, string[]> = {};

projects.forEach((projectId) => {
  const projectPath = path.join(projectsDir, projectId);
  if (fs.statSync(projectPath).isDirectory()) {
    const images = fs
      .readdirSync(projectPath)
      .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .sort() // alphabetical order
      .map((file) => `/images/projects/${projectId}/${file}`);

    projectImages[projectId] = images;
  }
});

const output = `export const projectImages = ${JSON.stringify(projectImages, null, 2)};`;
fs.writeFileSync(path.join(process.cwd(), 'src/data/projectImages.ts'), output);

console.log('✅ Generated projectImages.ts');
