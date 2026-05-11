import InvalidParameters from "../../../../../src/modules/shared/core/errors/InvalidParameters";
import Url from "../../../../../src/modules/shared/core/objects/URL";

describe('Url value object tests', () => {

  it('Should create a valid http URL', () => {
    const url = new Url('http://localhost.com');
    expect(url.getUrl()).toBe('http://localhost.com');
  });

  it('Should accept a valid https URL', () => {
    const url = new Url('https://example.com');
    expect(url.getUrl()).toBe('https://example.com');
  });

  it('Should accept a URL with subdomain', () => {
    const url = new Url('https://sub.example.com');
    expect(url.getUrl()).toBe('https://sub.example.com');
  });

  it('Should accept a URL with port', () => {
    const url = new Url('https://example.com:8080');
    expect(url.getUrl()).toBe('https://example.com:8080');
  });

  it('Should accept a URL with path', () => {
    const url = new Url('https://example.com/path/to/resource');
    expect(url.getUrl()).toBe('https://example.com/path/to/resource');
  });

  it('Should accept a URL with query parameters', () => {
    const url = new Url('https://example.com/search?q=jest&lang=en');
    expect(url.getUrl()).toBe('https://example.com/search?q=jest&lang=en');
  });

  it('Should accept a URL with hash fragment', () => {
    const url = new Url('https://example.com/page#section2');
    expect(url.getUrl()).toBe('https://example.com/page#section2');
  });

  it('Should accept a URL with path, query and hash', () => {
    const url = new Url('https://example.com/products/item?id=10#reviews');
    expect(url.getUrl()).toBe('https://example.com/products/item?id=10#reviews');
  });

  it('Should accept a valid AWS S3 image URL', () => {
    const url = new Url('https://my-bucket.s3.amazonaws.com/images/photo.png');
    expect(url.getUrl()).toBe(
      'https://my-bucket.s3.amazonaws.com/images/photo.png'
    );
  });

  it('Should throw if protocol is missing', () => {
    expect(() => new Url('example.com')).toThrow(InvalidParameters);
  });

  it('Should throw if using unsupported protocol', () => {
    expect(() => new Url('ftp://example.com')).toThrow(InvalidParameters);
  });

  it('Should throw if domain lacks top-level part', () => {
    expect(() => new Url('https://example')).toThrow(InvalidParameters);
  });

  it('Should throw if domain has invalid characters', () => {
    expect(() => new Url('https://exam!ple.com')).toThrow(InvalidParameters);
  });

  it('Should throw if URL has spaces', () => {
    expect(() => new Url('https://exa mple.com')).toThrow(InvalidParameters);
  });

  it('Should throw if URL is empty', () => {
    expect(() => new Url('')).toThrow(InvalidParameters);
  });

  it('Should throw if URL starts with // without protocol', () => {
    expect(() => new Url('//example.com')).toThrow(InvalidParameters);
  });
});
