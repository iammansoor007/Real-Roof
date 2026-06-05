const ffmpeg = require('ffmpeg-static');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'public', 'RealRoof.mp4');
const outputPath = path.join(__dirname, '..', 'public', 'RealRoof_compressed.mp4');

console.log(`Ffmpeg binary: ${ffmpeg}`);
console.log(`Input video path: ${inputPath}`);
console.log(`Output video path: ${outputPath}`);

try {
  // Check input video size
  const inputStats = fs.statSync(inputPath);
  console.log(`Original Size: ${(inputStats.size / (1024 * 1024)).toFixed(2)} MB`);

  // Run ffmpeg compression
  console.log("Starting re-encoding, trimming to 12s, scaling to 720p, and removing audio...");
  
  const cmd = `"${ffmpeg}" -y -i "${inputPath}" -t 12 -vf "scale=1280:-2" -vcodec libx264 -crf 28 -preset medium -an "${outputPath}"`;
  console.log(`Running command: ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });

  const outputStats = fs.statSync(outputPath);
  console.log(`Compressed Size: ${(outputStats.size / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Saved: ${((inputStats.size - outputStats.size) / (1024 * 1024)).toFixed(2)} MB (${((1 - outputStats.size / inputStats.size) * 100).toFixed(1)}% reduction)`);

  // Overwrite original video files
  const backupPath = inputPath + '.bak';
  if (!fs.existsSync(backupPath)) {
    fs.renameSync(inputPath, backupPath);
    console.log("Original video backed up to RealRoof.mp4.bak");
  } else {
    fs.unlinkSync(inputPath);
  }
  
  fs.copyFileSync(outputPath, inputPath);
  console.log("Overwrote public/RealRoof.mp4");

  const duplicatePath = inputPath + '.mp4'; // RealRoof.mp4.mp4
  if (fs.existsSync(duplicatePath)) {
    fs.unlinkSync(duplicatePath);
  }
  fs.copyFileSync(outputPath, duplicatePath);
  console.log("Overwrote public/RealRoof.mp4.mp4");

  // Also clean up temp output file
  fs.unlinkSync(outputPath);
  console.log("Cleaned up temporary output file.");
  console.log("Video compression and trimming completed successfully!");

} catch (err) {
  console.error("Compression failed:", err);
}
