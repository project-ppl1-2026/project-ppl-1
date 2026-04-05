// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
let content = fs.readFileSync(
  "src/components/landing/hero-section.tsx",
  "utf8",
);
content = content.replace(
  /\[\s*"ðŸ˜¢",\s*"ðŸ˜Ÿ",\s*"ðŸ˜",\s*"ðŸ™‚",\s*"ðŸ˜„"\s*\]/g,
  '["😢", "😔", "😐", "🙂", "😄"]',
);
fs.writeFileSync("src/components/landing/hero-section.tsx", content);
