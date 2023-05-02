const mongoose = require('mongoose')
const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'draft',
    enum: ['draft', 'published', 'unpublished','deleted', 'inProgress', 'submitted', 'confirmed', 'completed', 'expired'],
  },
  title: {
    type: String,
    required: [true, "Please enter your task's title.喔"]
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    default: ''
  },
  salary: {
    type: Number,
    required: false,
    default: 0
  },
  exposurePlan: {
    type: String,
    required: false,
    enum: ['一般方案', '限時方案', '黃金曝光', '限時黃金曝光']
  },
  imgUrls: {
    type: [String],
    required: false,
    default: []
  },
  contactInfo: {
    name: {
      type: String,
      required: false,
      default: ''
    },
    phone: {
      type: String,
      required: false,
      default: ''
    },
    email: {
      type: String,
      required: false,
      default: ''
    }
  },
  location: {
    city: {
      type: String,
      required: false,
      default: ''
    },
    dist: {
      type: String,
      required: false,
      default: ''
    },
    address: {
      type: String,
      required: false,
      default: ''
    },
    landmark: {
      type: String,
      required: false,
      default: ''
    },
    longitude: {
      type: Number || null,
      required: false,
      default: null
    },
    latitude: {
      type: Number || null,
      required: false,
      default: null
    }
  },
  viewers: {
    type: [String],
    default: []
  },
  viewerCount: {
    type: Number,
    default: 0
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  helpers: {
    type: [
      {
        helperId: {
          type: String
        },
        status: {
          type: String
        }
      }
    ],
    default: []
  },
  time: {
    createdAt: {
      type: Date
    },
    updatedAt: {
      type: Date
    },
    publishedAt: {
      type: Date
    },
    unpublishedAt: {
      type: Date
    },
    deletedAt: {
      type: Date
    },
    inProgressAt: {
      type: Date
    },
    submittedAt: {
      type: Date
    },
    confirmedAt: {
      type: Date
    },
    completedAt: {
      type: Date
    },
    expiredAt: {
      type: Date
    }
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  submmitInfo: {
    imgUrls: {
      type: [String]
    },
    comment: {
      type: String
    },
    createAt: {
      type: Date
    }
  }
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
