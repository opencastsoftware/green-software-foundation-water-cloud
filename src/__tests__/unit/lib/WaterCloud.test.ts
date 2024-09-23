import {WaterCloud} from '../../../lib/water-cloud';
import {ConfigParams} from '../../../lib/water-cloud/types';

describe('WaterCloud', () => {
  const waterCloud = WaterCloud({});

  describe('execute', () => {
    test('should throw error if input energy is invalid', async () => {
      const inputs = [{energy: 'test'}];
      const config: ConfigParams = [];
      await expect(waterCloud.execute(inputs, config)).rejects.toThrow(
        'Energy must be numeric'
      );
    });

    test('should  return valid output if input is valid', async () => {
      const inputs = [{energy: 10}];
      const config: ConfigParams = [];
      const result = await waterCloud.execute(inputs, config);
      expect(result[0]['water-cloud']).toBe(18);
    });

    test('should return valid output to each if multuple inputs passed', async () => {
      const inputs = [{energy: 10}, {energy: 20}];
      const config: ConfigParams = [];
      const result = await waterCloud.execute(inputs, config);
      expect(result[0]['water-cloud']).toBe(18);
      expect(result[1]['water-cloud']).toBe(36);
    });
  });
});
