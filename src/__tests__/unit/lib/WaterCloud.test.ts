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

    test('should throw error if input cloud/vendor is invalid', async () => {
      const inputs = [{energy: 10, 'cloud/vendor': 3}];
      const config: ConfigParams = [];
      await expect(waterCloud.execute(inputs, config)).rejects.toThrow(
        'Cloud vendor must be a string'
      );
    });

    test('should throw error if input wue is invalid', async () => {
      const inputs = [{energy: 10, wue: 'dd'}];
      const config: ConfigParams = [];
      await expect(waterCloud.execute(inputs, config)).rejects.toThrow(
        'Supplied WUE must be numeric'
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

    test('should return valid output when cloud vendor is specified as AWS', async () => {
      const inputs = [
        {energy: 10, 'cloud/vendor': 'AWS'},
        {energy: 20, 'cloud/vendor': 'Azure'},
        {energy: 10, 'cloud/vendor': 'GCP'},
      ];
      const config: ConfigParams = [];
      const result = await waterCloud.execute(inputs, config);
      expect(result[0]['water-cloud']).toBe(1.8);
      expect(result[1]['water-cloud']).toBe(9.8);
      expect(result[2]['water-cloud']).toBe(11);
    });

    test('should return use supplied WUE if present', async () => {
      const inputs = [{wue: 0.5, energy: 10}, {energy: 20}];
      const config: ConfigParams = [];
      const result = await waterCloud.execute(inputs, config);
      expect(result[0]['water-cloud']).toBe(5);
      expect(result[1]['water-cloud']).toBe(36);
    });

    test('should return correct data if azure region specified', async () => {
      const inputs = [
        {'cloud/vendor': 'Azure', 'cloud/region': 'Asia Pacific', energy: 10},
      ];
      const config: ConfigParams = [];
      const result = await waterCloud.execute(inputs, config);
      expect(result[0]['water-cloud']).toBe(16.5);
    });

    test('should return default if cloud provider not in list', async () => {
      const inputs = [
        {'cloud/vendor': 'Oracle', 'cloud/region': 'Asia Pacific', energy: 10},
      ];
      const config: ConfigParams = [];
      const result = await waterCloud.execute(inputs, config);
      expect(result[0]['water-cloud']).toBe(18);
    });
  });
});
