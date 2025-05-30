const Campaign = require('../models/campaignModel')
const cloudinaryUpload = require('../config/cloudinaryUpload')
const PickUp = require('../models/pickUpModel')
const User = require('../models/userModel')
const DropOffLocation = require('../models/dropOffLocationModel')

exports.createCampaign = async (req, res) => {
  const { name, description, endDate, goal, dropOffLocationId } = req.body

  try {
    const findCampaign = await Campaign.findOne({
      name
    })

    if (findCampaign) {
      return res.status(400).json({
        message: 'Campaign with name already exists'
      })
    }

    const findDropOffLocation = await DropOffLocation.findOne({
      _id: dropOffLocationId
    })

    if (!findDropOffLocation) {
      return res.status(400).json({
        message: 'Drop off location not found'
      })
    }

    const fileStr = req.body.image
    if (!fileStr) {
      return res.status(400).json({
        message: 'image is required'
      })
    }
    const result = await cloudinaryUpload.image(fileStr)

    const newCampaign = new Campaign({
      name,
      description,
      endDate,
      itemType: findDropOffLocation.itemType,
      goal,
      image: {
        public_id: result.public_id,
        url: result.secure_url
      },
      dropOffLocation: findDropOffLocation._id
    })

    await newCampaign.save()

    return res.status(201).json({
      message: 'Campaign added successfully',
      data: newCampaign
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}

exports.getCampaign = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({
      message: 'an id must be included'
    })
  }

  try {
    const campaign = await Campaign.findById(id)

    if (!campaign) {
      return res.status(404).json({
        message: 'Campaign not found'
      })
    }

    // get the number of pickups for this campaign using countDocuments
    const pickups = await PickUp.countDocuments({
      campaign: id
    })

    return res.status(200).json({
      data: {
        campaign,
        pickupCount: pickups || 0
      },
      message: 'Campaign fetched successfully'
    })
  } catch (err) {
    return res.status(500).json({
      message: err.message
    })
  }
}

exports.getCampaigns = async (req, res) => {
  const { page = 1, limit = 10, status, id } = req.query

  try {
    // if there is an id just return that campaign
    if (id) {
      const campaign = await Campaign.findById(id)

      if (!campaign) {
        return res.status(404).json({
          message: 'Campaign not found'
        })
      }

      return res.status(200).json({
        data: campaign,
        message: 'Campaign fetched successfully'
      })
    }

    const query = {}

    if (status) {
      query.status = status
    }

    const campaigns = await Campaign.paginate(query, {
      page,
      limit,
      sort: {
        createdAt: -1
      }
    })

    return res.status(200).json({
      data: campaigns,
      message: 'Campaigns fetched successfully'
    })
  } catch (err) {
    return res.status(500).json({
      message: err.message
    })
  }
}

exports.updateCampaign = async (req, res) => {
  const { id } = req.params
  const { name, description, startDate, endDate, material, goal } = req.body

  try {
    const campaign = await Campaign.findById(id)

    if (!campaign) {
      return res.status(404).json({
        message: 'Campaign not found'
      })
    }

    let image

    if (req.body.image) {
      const imageUpload = await cloudinaryUpload.image(req.body.image)

      if (imageUpload) {
        image = {
          public_id: imageUpload.public_id,
          url: imageUpload.secure_url
        }
      }

      // if there is an old image, delete it
      if (campaign.image.public_id) {
        await cloudinaryUpload.deleteImage(campaign.image.public_id)
      }
    }

    campaign.name = name
    campaign.description = description
    campaign.startDate = startDate
    campaign.endDate = endDate
    campaign.material = material
    campaign.goal = goal
    if (image) campaign.image = image

    await campaign.save()

    return res.status(200).json({
      message: 'Campaign updated successfully',
      data: campaign
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}

exports.deleteCampaign = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({
      message: 'an id must be included'
    })
  }

  try {
    await Campaign.findByIdAndDelete(id)

    return res.status(200).json({
      message: 'successfully deleted the campaign'
    })
  } catch (err) {
    return res.status(500).json({
      message: err.message
    })
  }
}

exports.getContributors = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({
      message: 'an id must be included'
    })
  }

  try {
    const campaign = await Campaign.findById(id)

    if (!campaign) {
      return res.status(404).json({
        message: 'Campaign not found'
      })
    }

    const pickups = await PickUp.find({
      campaign: id
    })

    const userIds = [...new Set(pickups.map(pickup => pickup.user._id.toString()))]

    // Fetch users by their IDs
    const users = await User.find({ _id: { $in: userIds } })
      .select('firstName lastName email profilePicture')

    // Calculate the number of contributions for each user
    const userContributions = users.map(user => {
      const contributions = pickups.filter(pickup => pickup.user._id.toString() === user._id.toString()).length
      return {
        ...user.toObject(),
        contributions
      }
    })

    return res.status(200).json({
      data: {
        users: userContributions,
        pickupCount: pickups.length
      },
      message: 'Contributors fetched successfully'
    })
  } catch (err) {
    return res.status(500).json({
      message: err.message
    })
  }
}
