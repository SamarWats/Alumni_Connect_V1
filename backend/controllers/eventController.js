const Event = require("../models/Event");
const User = require("../models/User");
const sendNotification = require("../utils/sendNotification");


// 1. Create Event

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, time, venue, bannerImage } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      time,
      venue,
      bannerImage: bannerImage || null,
      createdBy: req.user._id,
      creatorRole: req.user.role,
    });

    // Send Notification (Optional)
    const io = req.app.get("io");

    await sendNotification(
      {
        user: req.user._id,
        fromUser: req.user._id,
        type: "event_created",
        message: `Your event "${event.title}" was created successfully.`,
      },
      io
    );

    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};


// 2. Get All Events (with filters)

exports.getAllEvents = async (req, res) => {
  try {
    const { status, creatorRole, date } = req.query;

    let filter = {};

    if (status) filter.status = status;
    if (creatorRole) filter.creatorRole = creatorRole;
    if (date) filter.date = new Date(date);

    const events = await Event.find(filter)
      .populate("createdBy", "name email role")
      .sort({ date: 1 });

    res.status(200).json({ events });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};


// 3. Get Event by ID

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email role")
      .populate("registeredUsers.user", "name email role");

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    res.status(200).json({ event });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};


// 4. Update Event

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    // Only admin or creator can update
    if (
      req.user.role !== "admin" &&
      event.createdBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this event" });
    }

    Object.assign(event, req.body);
    await event.save();

    res.status(200).json({ message: "Event updated successfully", event });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};


// 5. Delete Event

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    if (
      req.user.role !== "admin" &&
      event.createdBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this event" });
    }

    await event.deleteOne();

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};


// 6. Register for Event

exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy");

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    // Prevent duplicate registration
    if (
      event.registeredUsers.some(
        (reg) => reg.user.toString() === req.user._id.toString()
      )
    ) {
      return res
        .status(400)
        .json({ message: "You have already registered for this event" });
    }

    event.registeredUsers.push({ user: req.user._id });
    await event.save();

    const io = req.app.get("io");

    // Notify creator
    await sendNotification(
      {
        user: event.createdBy._id,
        fromUser: req.user._id,
        type: "event_registration",
        message: `${req.user.name} registered for your event "${event.title}".`,
      },
      io
    );

    // Notify participant
    await sendNotification(
      {
        user: req.user._id,
        fromUser: event.createdBy._id,
        type: "event_registration",
        message: `You registered for the event "${event.title}".`,
      },
      io
    );

    res
      .status(200)
      .json({ message: "Registered for event successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};


// 7. Get Registered Users

exports.getRegisteredUsers = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "registeredUsers.user",
      "name email role"
    );

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    if (
      req.user.role !== "admin" &&
      event.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to view participants",
      });
    }

    res.status(200).json({
      participants: event.registeredUsers,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
