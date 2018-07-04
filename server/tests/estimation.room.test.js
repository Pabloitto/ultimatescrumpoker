const chai = require('chai')
const should = chai.should()
const sinon = require('sinon')

const { EstimationRoomService } = require('../src/services/estimation-room')

describe('Estimation room tests: ', () => {
  it('should create an instance of estimation room service', () => {
    const estimationRoom = EstimationRoomService({ client: {} })
    should.exist(estimationRoom)
  })
  it('should init the room', () => {
    const client = {
      join: sinon.stub(),
      emit: sinon.stub()
    }
    const estimationRoom = EstimationRoomService({ client })
    estimationRoom.init('1')
    const [ joinFirstCall ] = client.join.args
    chai.expect(joinFirstCall[0]).to.equal('1')
    const [ emitFirstCall ] = client.emit.args
    chai.expect(emitFirstCall[0]).to.equal('update')
    chai.expect(emitFirstCall[1]).to.equal(JSON.stringify({
      roomId: '1',
      users: {}
    }))
  })
  it('should join the user to the room', () => {
    const rooms = {
      '1': {
        roomId: '1',
        users: {}
      }
    }
    const broadcastCallBack = sinon.stub()
    const client = {
      id: '123456',
      broadcast: {
        to: () => ({
          emit: broadcastCallBack
        })
      },
      emit: sinon.stub()
    }
    const estimationRoom = EstimationRoomService({
      client,
      rooms
    })
    estimationRoom.join('1', {
      name: 'test',
      estimation: 1,
      flipped: false
    })
    const expectedValue = {
      roomId: '1',
      users: {
        '123456': {
          name: 'test',
          estimation: 1,
          flipped: false
        }
      }
    }
    const [ emitFirstCall ] = client.emit.args
    chai.expect(emitFirstCall[0]).to.equal('update')
    chai.expect(emitFirstCall[1]).to.equal(JSON.stringify(expectedValue))
    const [ broadcastFirstCall ] = broadcastCallBack.args
    chai.expect(broadcastFirstCall[0]).to.equal('update')
    chai.expect(broadcastFirstCall[1]).to.equal(JSON.stringify(expectedValue))
  })
})
