// example unit tests
'use strict';

//Mocking is missing completely TODO add mocked objects

describe('Database', () => {

  let db, helper; //expect

  beforeEach((done) => {
    //Clean everything up before doing new tests
    Object.keys(require.cache).forEach((key) => delete require.cache[key]);
    require('chai').should();
    let chai = require('chai');
    let chaiAsPromised = require('chai-as-promised');
    chai.use(chaiAsPromised);
    //expect = require('chai').expect;
    db = require('../database/activitiesDatabase.js');
    helper = require('../database/helper.js');
    helper.cleanDatabase()
      .then(() => done())
      .catch((error) => done(error));
  });

  context('when having an empty database', () => {
    it('should return null when requesting a non existant activity', () => {
      return db.get('asd7db2daasd').should.be.fulfilled.and.become(null);
    });
    it('should return empty array when requesting activities for non existant content', () => {
      return db.getAllForDeckOrSlide('slide', 'asd7db2daasd').should.be.fulfilled.and.become([]);
    });

    it('should return empty array when requesting all comments in the collection', () => {
      return db.getAllFromCollection().should.be.fulfilled.and.become([]);
    });

    it('should return the activity when inserting one', () => {
      let activity = {
        activity_type: 'add',
        content_id: '112233445566778899000671-1',
        content_kind: 'slide',
        content_name: ' ',
        content_owner_id: '000000000000000000000000',
        user_id: '000000000000000000000000'
      };
      let res = db.insert(activity);
      return Promise.all([
        res.should.be.fulfilled.and.eventually.not.be.empty,
        res.should.eventually.have.property('ops').that.is.not.empty,
        // res.should.eventually.have.deep.property('ops[0]').that.has.all.keys('_id', 'activity_type', 'timestamp', 'content_id', 'content_kind', 'content_name', 'content_owner_id', 'user_id'),
        // res.should.eventually.have.deep.property('ops[0].activity_type', activity.activity_type)
      ]);
    });

    it('should get an previously inserted activity', () => {
      let activity = {
        activity_type: 'add',
        content_id: '112233445566778899000671-1',
        content_kind: 'slide',
        content_name: ' ',
        content_owner_id: '000000000000000000000000',
        user_id: '000000000000000000000000'
      };
      let ins = db.insert(activity);
      let res = ins.then((ins) => db.get(ins.ops[0]._id));
      return Promise.all([
        res.should.be.fulfilled.and.eventually.not.be.empty,
        res.should.eventually.have.all.keys('_id', 'activity_type', 'timestamp', 'content_id', 'content_kind', 'content_name', 'content_owner_id', 'user_id'),
        res.should.eventually.have.property('activity_type', activity.activity_type)
      ]);
    });

    it('should be able to replace an previously inserted activity', () => {
      let activity = {
        activity_type: 'add',
        content_id: '112233445566778899000671-1',
        content_kind: 'slide',
        content_name: ' ',
        content_owner_id: '000000000000000000000000',
        user_id: '000000000000000000000000'
      };
      let activity2 = {
        activity_type: 'share',
        content_id: '112233445566778899000671-1',
        content_kind: 'slide',
        content_name: ' ',
        content_owner_id: '000000000000000000000000',
        user_id: '000000000000000000000000'
      };
      let ins = db.insert(activity);
      let res = ins.then((ins) => db.replace(ins.ops[0]._id, activity2));
      res = ins.then((ins) => db.get(ins.ops[0]._id));
      return Promise.all([
        res.should.be.fulfilled.and.eventually.not.be.empty,
        res.should.eventually.have.all.keys('_id', 'activity_type', 'timestamp', 'content_id', 'content_kind', 'content_name', 'content_owner_id', 'user_id'),
        res.should.eventually.have.property('activity_type', 'share')
      ]);
    });

    it('should be able to delete a previously inserted activity', () => {
      let activity = {
        activity_type: 'add',
        content_id: '112233445566778899000671',
        content_kind: 'slide',
        content_name: ' ',
        content_owner_id: '000000000000000000000000',
        user_id: '000000000000000000000000'
      };

      let ins = db.insert(activity);
      let res = ins.then((ins) => db.delete(ins.ops[0]._id));
      return ins.then((ins) => db.get(ins.ops[0]._id)).should.be.fulfilled.and.become(null);
    });

    it('should be able to delete all activities for the content', () => {
      let activity = {
        activity_type: 'add',
        content_id: '112233445566778899000671',
        content_kind: 'slide',
        content_name: ' ',
        content_owner_id: '000000000000000000000000',
        user_id: '000000000000000000000000'
      };
      let activity2 = {
        activity_type: 'share',
        content_id: '112233445566778899000671',
        content_kind: 'slide',
        content_name: ' ',
        content_owner_id: '000000000000000000000000',
        user_id: '000000000000000000000000'
      };
      let ins = db.insert(activity);
      let res = ins.then((ins) => db.insert(activity2));
      let res2 = res.then((res) => db.deleteAllWithContentID('112233445566778899000671'));
      return res2.then((res2) => db.getAllForDeckOrSlide('slide', '112233445566778899000671')).should.be.fulfilled.and.become([]);
    });
    it('should be able to delete all activities from the collection', () => {
      let activity = {
        activity_type: 'add',
        content_id: '112233445566778899000671',
        content_kind: 'slide',
        content_name: ' ',
        content_owner_id: '000000000000000000000000',
        user_id: '000000000000000000000000'
      };
      let activity2 = {
        activity_type: 'share',
        content_id: '112233445566778899000671',
        content_kind: 'slide',
        content_name: ' ',
        content_owner_id: '000000000000000000000000',
        user_id: '000000000000000000000000'
      };
      let ins = db.insert(activity);
      let res = ins.then((ins) => db.insert(activity2));
      let res2 = res.then((res) => db.deleteAll());
      return res2.then((res2) => db.getAllFromCollection()).should.be.fulfilled.and.become([]);
    });
  });
});
