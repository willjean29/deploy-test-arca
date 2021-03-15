import { IsNotEmpty, IsOptional } from 'class-validator';
import { TopicError } from '../enum';

export class TopicCommentDto {
  @IsNotEmpty({ message: TopicError.AUTHOR, always: true })
  author: string;

  @IsNotEmpty({ message: TopicError.COMMENT, always: true })
  comment: string;

  @IsNotEmpty({ message: TopicError.DATE, always: true })
  date: string;

  @IsNotEmpty({ message: TopicError.NAME, always: true })
  name: string;

  @IsNotEmpty({ message: TopicError.TYPE, always: true })
  type: number;

  @IsNotEmpty({ message: TopicError.PROFILE_IMG, always: true })
  profileImg: string;

  @IsOptional()
  @IsNotEmpty({ message: TopicError.FILE, always: true })
  file?: string;

  @IsOptional()
  @IsNotEmpty({ message: TopicError.LINK, always: true })
  link?: string;
}
