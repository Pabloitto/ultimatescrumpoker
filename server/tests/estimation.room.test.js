const chai = require('chai')

const sinon = require('sinon')

const { noop } = require('lodash')

const { EstimationRoomService } = require('../src/services/estimation-room')

const should = chai.should()

const sandbox = sinon.createSandbox()

const io = {
  sockets: {
    sockets: {}
  }
}

const RoomModel = {
  create: noop,
  findOne: noop,
  updateOne: noop
}

describe('Estimation room tests: ', () => {
  beforeEach(() => {
    sandbox.restore()
  })
  it('should create an instance of estimation room service', () => {
    const estimationRoom = EstimationRoomService({
      io,
      client: {},
      RoomModel
    })
    should.exist(estimationRoom)
  })
  it('should init the room', async () => {
    const mock = { roomId: '1', users: [] }
    const client = {
      join: sandbox.stub(),
      emit: sandbox.stub()
    }
    sandbox.stub(RoomModel, 'create').returns(mock)
    const estimationRoom = EstimationRoomService({
      io,
      client,
      RoomModel
    })
    await estimationRoom.init('1')
    const [ joinFirstCall ] = client.join.args
    chai.expect(joinFirstCall[0]).to.equal('1')
    const [ emitFirstCall ] = client.emit.args
    chai.expect(emitFirstCall[0]).to.equal('update')
    chai.expect(emitFirstCall[1]).to.equal(JSON.stringify(mock))
  })
  it('should join the user to the room', async () => {
    sandbox.stub(RoomModel, 'findOne').returns({
      roomId: '1',
      save: noop,
      users: []
    })
    const broadcastCallBack = sandbox.stub()
    const client = {
      id: '123456',
      broadcast: {
        to: () => ({
          emit: broadcastCallBack
        })
      },
      emit: sandbox.stub()
    }
    const estimationRoom = EstimationRoomService({
      io,
      client,
      RoomModel
    })
    await estimationRoom.join('1', {
      name: 'test',
      estimation: 1,
      flipped: false
    })
    const expectedValue = {
      roomId: '1',
      users: [
        {
          name: 'test',
          estimation: 1,
          flipped: false,
          clientId: '123456'
        }
      ]
    }
    const [ emitFirstCall ] = client.emit.args
    chai.expect(emitFirstCall[0]).to.equal('update')
    chai.expect(emitFirstCall[1]).to.equal(JSON.stringify(expectedValue))
    const [ broadcastFirstCall ] = broadcastCallBack.args
    chai.expect(broadcastFirstCall[0]).to.equal('update')
    chai.expect(broadcastFirstCall[1]).to.equal(JSON.stringify(expectedValue))
  })
  it('should send the estimation to the room', async () => {
    const broadcastCallBack = sandbox.stub()
    sandbox.stub(RoomModel, 'findOne').returns({
      roomId: '1',
      save: noop,
      users: [
        { name: 'x', clientId: '123456' }
      ]
    })
    const client = {
      id: '123456',
      broadcast: {
        to: () => ({
          emit: broadcastCallBack
        })
      },
      emit: sandbox.stub()
    }
    const expectedValue = {
      roomId: '1',
      users: [
        {
          name: 'x',
          estimation: 8,
          flipped: false,
          clientId: '123456'
        }
      ]
    }
    const estimationRoom = EstimationRoomService({
      io,
      client,
      RoomModel
    })
    await estimationRoom.estimate('1', 8)
    const [ emitFirstCall ] = client.emit.args
    chai.expect(emitFirstCall[0]).to.equal('update')
    chai.expect(JSON.parse(emitFirstCall[1])).to.deep.equal(expectedValue)
    const [ broadcastFirstCall ] = broadcastCallBack.args
    chai.expect(broadcastFirstCall[0]).to.equal('update')
    chai.expect(JSON.parse(broadcastFirstCall[1])).to.deep.equal(expectedValue)
  })
})
