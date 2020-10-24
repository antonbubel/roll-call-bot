const { createStartRollCallJob, createEndRollCallJob } = require('./jobs');

class Schedule {
  constructor() {
    this._initializeJobs();
  }

  async launch() {
  }

  _initializeJobs() {
    if (!this._startRollCallJob) {
      this._startRollCallJob = createStartRollCallJob();
    }

    if (!this._endRollCallJob) {
      this._endRollCallJob = createEndRollCallJob();
    }
  }
}

module.exports = new Schedule();
