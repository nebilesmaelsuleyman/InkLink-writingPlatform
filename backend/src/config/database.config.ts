import { Config } from './../../node_modules/cosmiconfig/dist/types.d';
import { registerAs } from '@nestjs/config'

export default registerAs('database', (): Config => ({
    uri: process.env.DATABASE_URL || 'mongodb://localhost:27017/seniorproject',
}));
