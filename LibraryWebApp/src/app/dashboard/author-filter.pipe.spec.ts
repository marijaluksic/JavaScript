import { AuthorFilterPipe } from './author-filter.pipe';

describe('AuthorFilterPipe', () => {
  it('create an instance', () => {
    const pipe = new AuthorFilterPipe();
    expect(pipe).toBeTruthy();
  });
});
