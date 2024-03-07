import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { validateIdFormat } from 'src/heplers/validateIdFormat';
import { CreateTrackDto } from './dto/create-track.dto';
import { isIdValid } from 'src/heplers/isIdValid';
import { v4 as uuidv4 } from 'uuid';
import { UpdateTrackDto } from './dto/update-track.dto';
import { DB } from 'src/db';

@Injectable()
export class TrackService {
  constructor(@Inject('DB_CONNECTION') private readonly db: DB) {}

  async getTracks() {
    return this.db.tracks;
  }

  async getTrackById(id: string) {
    validateIdFormat(id);

    const track = this.db.tracks.find((track) => track.id === id);
    if (track) {
      return track;
    } else {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
  }

  async createTrack(createTrackDto: CreateTrackDto) {
    if (
      !createTrackDto.name ||
      !isIdValid(createTrackDto.albumId) ||
      !isIdValid(createTrackDto.artistId)
    ) {
      throw new BadRequestException(
        'Request body does not contain required fields or their format is not correct',
      );
    } else {
      const newTrack = {
        id: uuidv4(),
        ...createTrackDto,
      };
      this.db.tracks.push(newTrack);
      return newTrack;
    }
  }

  async deleteTrack(id: string) {
    validateIdFormat(id);
    const track = this.db.tracks.find((track) => track.id === id);
    if (track) {
      this.db.tracks.splice(this.db.tracks.indexOf(track), 1);
    } else {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
  }

  async updateTrack(updateTrackDto: UpdateTrackDto, id: string) {
    if (
      !updateTrackDto.name ||
      !isIdValid(updateTrackDto.albumId) ||
      !isIdValid(updateTrackDto.artistId)
    ) {
      throw new BadRequestException(
        'Request body does not contain required fields or their format is not correct',
      );
    }
    validateIdFormat(id);
    const track = this.db.tracks.find((track) => track.id === id);
    if (track) {
      const updatedTrack = {
        ...track,
        ...updateTrackDto,
      };
      const trackIdx = this.db.tracks.indexOf(track);
      this.db.tracks[trackIdx] = updatedTrack;
      return updatedTrack;
    } else {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
  }
}
