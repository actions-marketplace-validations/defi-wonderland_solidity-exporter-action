import glob from 'glob';
import path from 'path';
import fse from 'fs-extra';
import { execSync } from 'child_process';
import { PackageJson } from './types';
import { createReadmeAndLicense } from './createReadmeAndLicense';
import { transformRemappings } from './transformRemappings';
import { TypingType } from './constants';

export const createPackage = (
  exportDir: string,
  outDir: string,
  interfacesDir: string,
  contractsExportDir: string,
  packageJson: PackageJson,
  typingType: TypingType,
) => {
  const abiDir = `${exportDir}/abi`;
  const contractsDir = `${exportDir}/contracts`;

  const interfacesGlob = `${interfacesDir}/**/*.sol`;
  const contractsGlob = `${contractsExportDir}/**/*.sol`;

  // empty export directory
  fse.emptyDirSync(exportDir);
  fse.writeJsonSync(`${exportDir}/package.json`, packageJson, { spaces: 4 });

  createReadmeAndLicense(packageJson.name, typingType, exportDir);

  // list all of the solidity interfaces
  glob(interfacesGlob, (err, interfacePaths) => {
    if (err) throw err;

    // for each interface path
    for (const interfacePath of interfacePaths) {
      const interfaceFile = fse.readFileSync(interfacePath, 'utf8');
      const relativeInterfaceFile = transformRemappings(interfaceFile);

      const contractPath = interfacePath.substring(interfacesDir.length + 1);
      fse.outputFileSync(path.join(contractsDir, contractPath), relativeInterfaceFile);

      // get the interface name
      const interfaceName = interfacePath.substring(interfacePath.lastIndexOf('/') + 1, interfacePath.lastIndexOf('.'));

      // copy interface abi to the export directory
      fse.copySync(`${outDir}/${interfaceName}.sol/${interfaceName}.json`, `${abiDir}/${interfaceName}.json`);
    }
    console.log(`Copied ${interfacePaths.length} interfaces`);

    if (typingType === TypingType.CONTRACTS) {
      glob(contractsGlob, (err, contractPaths) => {
        if (err) throw err;

        for (const contractPath of contractPaths) {
          const contractFile = fse.readFileSync(contractPath, 'utf8');
          const relativeContractFile = transformRemappings(contractFile);

          const relativeContractPath = contractPath.substring(contractsExportDir.length + 1);
          fse.outputFileSync(path.join(exportDir, relativeContractPath), relativeContractFile);

          const contractName = contractPath.substring(contractPath.lastIndexOf('/') + 1, contractPath.lastIndexOf('.'));
          fse.copySync(`${outDir}/${contractName}.sol/${contractName}.json`, `${abiDir}/${contractName}.json`);
        }
        console.log(`Copied ${contractPaths.length} contracts`);
      });
    }

    // install package dependencies
    console.log(`Installing abi dependencies`);
    execSync(`cd ${exportDir} && yarn`);

    // use typechain if needed
    if (typingType === TypingType.ETHERS_V6 || typingType === TypingType.WEB3_V1) {
      console.log(`Generating types for ${typingType}`);
      execSync(`yarn typechain --target ${typingType} --out-dir ${exportDir}/${typingType} '${exportDir}/abi/*.json'`);
    }
  });
};
