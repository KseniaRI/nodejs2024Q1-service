import { BadRequestException } from '@nestjs/common';

export const validateIdFormat = (id: string) => {
  if (
    !id.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    )
  ) {
    throw new BadRequestException(`User id ${id} is in wrong format`);
  }
};
