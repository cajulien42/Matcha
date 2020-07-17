const debug = require('debug')('tests:tag_route');
const Request = require('../../../util/requestsClass');
const invalidTags = require('../../data/tags/invalidTags');
const validTags = require('../../data/tags/validTags');
const incompleteTags = require('../../data/tags/incompleteTags');

const adminUser = {
  username: 'Camille',
  password: 'Test123*',
};

const validNewTag = {
  id: 'test',
  text: 'test',
};

const updatedNewTag = {
  id: 'test',
  text: 'test test test',
};

test('GET request : /api/tags/, expect tag list, true', async () => {
  const data = await new Request('/api/tags', null, null).get().catch(err => debug(err));
  return expect(data).toBeTruthy();
});

test('GET request : /api/tags/cat, expect tag detail', async () => {
  const data = await new Request('/api/tags/cat', null, null).get().catch(err => debug(err));
  return expect(data).toBeTruthy();
});

test('GET request : /api/tags/test, unexisting tag expect error 400', async () => {
  const data = await new Request('/api/tags/test', null, null).get().catch(err => debug(err));
  return expect(data).toBe(false);
});

test('POST request : /api/tags/, invalid auth expect 401 error', async () => {
  const data = await new Request('/api/tags', validTags[0], null).post().catch(err => debug(err));
  return expect(data).toBe(false);
});

test('POST request : /api/tags/, valid auth/ existing tag expect error 400', async () => {
  const req = {};
  const tag = validTags[0];
  req.tag = tag;
  req.token = await new Request('/api/auth', adminUser).post().catch(err => debug(err));
  const res = await new Request('/api/tags/', req.tag, { headers: { 'x-auth-token': req.token } }).post().catch(err => debug(err));
  return expect(res).toBe(false);
});

test('POST request : /api/tags/, valid auth/ tag expect tag created', async () => {
  const req = {};
  req.tag = validNewTag;
  req.token = await new Request('/api/auth', adminUser).post().catch(err => debug(err));
  const res = await new Request('/api/tags/', req.tag, { headers: { 'x-auth-token': req.token } }).post().catch(err => debug(err));
  return expect(res).toBeTruthy();
});

test('PUT request : /api/tags/, valid user expect tag updated', async () => {
  const req = {};
  req.value = updatedNewTag;
  req.token = await new Request('/api/auth', adminUser).post().catch(err => debug(err));
  const res = await new Request('/api/tags/test', req, { headers: { 'x-auth-token': req.token } }).put().catch(err => debug(err));
  return expect(res).toBeTruthy();
});

test('GET request : /api/tags/test, expect tag detail', async () => {
  const data = await new Request('/api/tags/test', null).get().catch(err => debug(err));
  return expect(data).toBeTruthy();
});

test('DEL request : /api/tags/, invalid tag expect tag error 400', async () => {
  const req = {};
  req.token = await new Request('/api/auth', adminUser).post().catch(err => debug(err));
  const res = await new Request('/api/tags/teste', null, { headers: { 'x-auth-token': req.token } }).delete().catch(err => debug(err));
  return expect(res).toBe(false);
});

test('DEL request : /api/tags/, valid auth/ tag expect tag deleted', async () => {
  const req = {};
  req.token = await new Request('/api/auth', adminUser).post().catch(err => debug(err));
  const res = await new Request('/api/tags/test', { headers: { 'x-auth-token': req.token } }, { headers: { 'x-auth-token': req.token } }).delete().catch(err => debug(err));
  return expect(res).toBeTruthy();
});
