import express from 'express';
import * as http from 'http'

import * as winston from 'winston'
import * as expressWinston from 'express-winston'
import cors from 'cors'
import debug from 'debug'
import dotenv from 'dotenv'

const app: express.Application = express();