import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;
  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery; 
    this.query = query;
  }
  //search query
  search(searchableFields: string[]) {
    const searchTerm = this.query?.searchTerm ;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: {
                $regex: searchTerm,
                $options: 'i',
              },
            }) as FilterQuery<T>,
        ),
      });
    }
    return this
  }

  //filter query
  filter(){
   const queryObj = {...this.query};
   const excludedFields = ['searchTerm','sort','limit','page','fields'];
   excludedFields.forEach((el) => delete queryObj[el]);
   this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
   return this;
  }


  //sort query
  sort(){
    const sort = ( this?.query?.sort as string)?.split(',')?.join(' ') || '-createAt'
    if (sort) {
      this.modelQuery = this.modelQuery.sort(sort as string);
    }
    return this;
  }

  //limit query
  paginate(){
    const limit = Number(this?.query?.limit || 10);
    const page = Number(this?.query?.page || 1);
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  //fields query
  fields(){
    const fields =( this?.query?.fields as string)?.split(',')?.join(' ') || '-_v';
    
    this.modelQuery = this.modelQuery.select(fields as string);
   
    return this;
  }
  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }


}

export default QueryBuilder;
