const { createReminderJob, createRollCallJob } = require('./jobs');

class Schedule {
  _reminderJob;
  _rollCallJob;

  constructor() {
    this._initializeJobs();
  }

  async launch() {
  }

  _initializeJobs() {
    if (!this._reminderJob) {
      this._reminderJob = createReminderJob();
    }

    if (!this._rollCallJob) {
      this._rollCallJob = createRollCallJob();
    }
  }
}

module.exports = new Schedule();
