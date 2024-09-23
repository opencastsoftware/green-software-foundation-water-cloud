import {ERRORS} from '@grnsft/if-core/utils';
import {PluginParams, ExecutePlugin} from '@grnsft/if-core/types';

import {ConfigParams} from './types';

const {InputValidationError} = ERRORS;
const WUE_DEFAULT = 1.8;

export const WaterCloud = (globalConfig: ConfigParams): ExecutePlugin => {
  const metadata = {
    kind: 'execute',
  };

  const validateInput = (input: PluginParams) => {
    if (typeof input['energy'] !== 'number') {
      throw new InputValidationError('Energy must be numeric');
    }

    return input;
  };

  const execute = async (inputs: PluginParams[]): Promise<PluginParams[]> => {
    return inputs.map(input => {
      globalConfig;
      const safeInput = validateInput(input);
      const energy = safeInput['energy'];
      const waterCloudConsumption = energy * WUE_DEFAULT;

      return {
        ...input,
        'water-cloud': waterCloudConsumption,
      };
    });
  };

  return {
    metadata,
    execute,
  };
};
