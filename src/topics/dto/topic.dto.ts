import { IsNotEmpty } from 'class-validator';
import { TopicError } from '../enum';

export class TopicDto {
  @IsNotEmpty({ message: TopicError.CLASSROOM })
  classroom: string;

  @IsNotEmpty({ message: TopicError.COMMENTS })
  comments: string[];

  @IsNotEmpty({ message: TopicError.TOPIC })
  topic: string;

  @IsNotEmpty({ message: TopicError.DESCRIPTION })
  description: string;
}
