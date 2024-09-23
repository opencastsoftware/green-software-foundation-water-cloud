import {ERRORS} from '@grnsft/if-core/utils';
import {PluginParams, ExecutePlugin} from '@grnsft/if-core/types';

import {ConfigParams} from './types';

const {InputValidationError} = ERRORS;
const WUE_DEFAULT = 1.8;

// published as of 2023
const awsWUE = 0.18;

// global average 2022
const azureWUE = 0.49;

// estimated from totals by New Scientist 2023
const gcpWUE = 1.1;

export const WaterCloud = (globalConfig: ConfigParams): ExecutePlugin => {
  const metadata = {
    kind: 'execute',
  };

  const validateInput = (input: PluginParams) => {
    const errors: string[] = [];
    const { energy, 'cloud/vendor': cloudVendor } = input;

    if (typeof energy !== 'number') {
      errors.push('Energy must be numeric');
    }
    if (cloudVendor && typeof cloudVendor !== 'string') {
      errors.push('Cloud vendor must be a string');
    }

    if (errors.length > 0) {
      throw new InputValidationError(errors.join(', '));
    }

    return input;
  };

  const execute = async (inputs: PluginParams[]): Promise<PluginParams[]> => {
    return inputs.map(input => {
      globalConfig;
      const safeInput = validateInput(input);
      const energy = safeInput['energy'];
      const waterCloudConsumption = Math.round(energy * wueCalculation(safeInput) * 100) / 100;

      return {
        ...input,
        'water-cloud': waterCloudConsumption,
      };
    });
  };

  const wueCalculation = (input: PluginParams): number => {
    const cloudVendor = (input['cloud/vendor'] as string)?.toLowerCase();

    switch (cloudVendor) {
      case 'aws':
        return awsWUE;
      case 'azure':
        return azureWUE;
      case 'gcp':
        return gcpWUE;
      default:
        return WUE_DEFAULT;
    }
  };
  
  return {
    metadata,
    execute,
  };
};
