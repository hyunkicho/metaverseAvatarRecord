const fs = require('fs');
const path = require('path');

const readJsonFile = (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading file ${filePath}: `, error);
    return null; // Return null to indicate failure
  }
};

const combinePlayerInfoData = () => {
  const combinedData = [];
  const rootDir = __dirname;
  const folders = [
    '1_100', '101_200', '201_300', '301_400', '401_500'
    // ,'501_600'
    // ,'601_700', '701_800', '801_900', '901_1000',
    // '1001_1100', '1101_1200', '1201_1300', '1301_1400',
    // '1401_1500', '1501_1600'
  ];

  folders.forEach(folder => {
    const dirPath = path.join(rootDir, folder);
    fs.readdirSync(dirPath).forEach(file => {
      const filePath = path.join(dirPath, file);
      if (path.extname(filePath) === '.json') {
        const playerData = readJsonFile(filePath);
        if (playerData) {
          combinedData.push(playerData);
        }
      }
    });
  });

  // Write the combined array to a file in the root directory
  const outputFilePath = path.join(rootDir, 'CombinedPlayerInfoData.json');
  fs.writeFileSync(outputFilePath, JSON.stringify(combinedData, null, 2), 'utf-8');

  console.log('Combined array length:', combinedData.length);
  console.log(`Combined data written to ${outputFilePath}`);
};

// Usage
combinePlayerInfoData();
