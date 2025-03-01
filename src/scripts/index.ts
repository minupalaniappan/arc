import { first } from 'lodash';
import {
  downloadPandemicOversightDataset,
  writePandemicOversightDatasetToDb,
} from './downloadPandemicOversightDataset';

const execute = async () => {
  const command = first(process.argv.slice(2));
  const verb = first(process.argv.slice(3));

  switch (command) {
    case 'pandemicoversight':
      if (verb === 'read') {
        await downloadPandemicOversightDataset();
      } else if (verb === 'write') {
        await writePandemicOversightDatasetToDb();
      }
      return;
  }
};

execute();
