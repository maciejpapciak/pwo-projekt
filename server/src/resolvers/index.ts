import { AdvancementLevelResolver } from './advancementLevel';
import { CategoryResolver } from './category';
import { HelloResolver } from './hello';
import { TagResolver } from './tag';
import { UserResolver } from './user';
import { FileResolver } from './files';
import { CourseResolver } from './course';
import { ChapterResolver } from './chapter';
import { LibraryResolver } from './library';
import { RatingResolver } from './rating';
import { FollowResolver } from './follow';
import { OrderResolver } from './order';
import { CourseTagResolver } from './coursetag';
import { ResolverCollectionType } from '../types/customTypes';

const allResolvers: ResolverCollectionType = [
  CourseTagResolver,
  FileResolver,
  AdvancementLevelResolver,
  CategoryResolver,
  HelloResolver,
  TagResolver,
  UserResolver,
  CourseResolver,
  ChapterResolver,
  LibraryResolver,
  RatingResolver,
  FollowResolver,
  OrderResolver,
];

export { allResolvers };
