import Joi from '@hapi/joi';

import { validateArgs } from '../../core';
import { Resolvers } from '../../global';
import { Capsule } from './capsule';
import * as capsuleService from './capsule.service';

const capsuleResolvers: Resolvers = {
  Query: {
    capsules: async (_, args): Promise<Capsule[]> => {
      const schema = Joi.object({
        limit: Joi.number().optional(),
        offset: Joi.number().max(3).optional(),
      });

      await validateArgs(args, schema);

      return capsuleService.getCapsules(...args);
    },
    capsule: async (_: any, args: any): Promise<Capsule> => {
      const { id } = args;
      return capsuleService.getCapsuleById(id);
    },
  },
};

export default capsuleResolvers;