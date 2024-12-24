import winston from 'winston';

export const logRequest = (message: string) => {
   const logger = winston.createLogger({
      level: 'info',
      transports: [
         new winston.transports.Console({
            format: winston.format.simple(),
         }),
         new winston.transports.File({
            filename: 'logs/requests.log',
            format: winston.format.combine(
               winston.format.timestamp(),
               winston.format.json(),
            ),
         }),
      ],
   });

   logger.info(message);
};
