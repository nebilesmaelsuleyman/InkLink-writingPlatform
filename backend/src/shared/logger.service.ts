import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppLogger extends Logger {
  // extend or customize Nest's Logger for cross-cutting logging
}
