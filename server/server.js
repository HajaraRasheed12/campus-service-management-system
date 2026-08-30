const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// =========================
// COMPLAINT SCHEMA
// =========================

const complaintSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },

  studentName: {
    type: String,
    required: true,
  },

  studentId: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  regarding: {
    type: String,
    default: "",
  },

  description: {
    type: String,
    required: true,
  },

  date: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default: "Under Review",
  },

  resolutionMessage: {
    type: String,
    default: "",
  },
});

const Complaint = mongoose.model("Complaint", complaintSchema);

// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "Campus Service Management API is running!",
  });
});

// =========================
// SUBMIT COMPLAINT
// =========================

app.post("/api/complaints", async (req, res) => {
  try {
    const {
      studentName,
      studentId,
      category,
      regarding,
      description,
    } = req.body;

    // Validate required fields
    if (
      !studentName ||
      !studentId ||
      !category ||
      !description
    ) {
      return res.status(400).json({
        message: "Please provide all required fields.",
      });
    }

    // Count existing complaints
    const complaintCount = await Complaint.countDocuments();

    // Generate complaint ID
    const complaintNumber = complaintCount + 1;

    const complaintId = `LBS-2026-${String(
      complaintNumber
    ).padStart(4, "0")}`;

    // Current date
    const currentDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    // Create complaint
    const newComplaint = new Complaint({
      id: complaintId,
      studentName: studentName.trim(),
      studentId: studentId.trim(),
      category,
      regarding: regarding || "",
      description: description.trim(),
      date: currentDate,
      status: "Under Review",
      resolutionMessage: "",
    });

    // Save to MongoDB
    const savedComplaint = await newComplaint.save();

    console.log("New complaint saved:", savedComplaint.id);

    res.status(201).json({
      message: "Complaint submitted successfully.",
      complaint: {
        id: savedComplaint.id,
        studentName: savedComplaint.studentName,
        studentId: savedComplaint.studentId,
        category: savedComplaint.category,
        regarding: savedComplaint.regarding,
        description: savedComplaint.description,
        date: savedComplaint.date,
        status: savedComplaint.status,
        resolutionMessage: savedComplaint.resolutionMessage,
      },
    });

  } catch (error) {
    console.error("Error saving complaint:", error);

    res.status(500).json({
      message: "Failed to save complaint.",
    });
  }
});

// =========================
// GET ALL COMPLAINTS
// =========================

app.get("/api/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ _id: -1 });

    res.json(complaints);

  } catch (error) {
    console.error("Error fetching complaints:", error);

    res.status(500).json({
      message: "Failed to fetch complaints.",
    });
  }
});

// =========================
// UPDATE COMPLAINT STATUS
// =========================

app.put("/api/complaints/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionMessage } = req.body;

    // Validate status
    const allowedStatuses = [
      "Pending",
      "Under Review",
      "In Progress",
      "Resolved",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid complaint status.",
      });
    }

    // Find complaint
    const complaint = await Complaint.findOne({ id });

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found.",
      });
    }

    // Update status
    complaint.status = status;

    // Update resolution message if provided
    if (resolutionMessage !== undefined) {
      complaint.resolutionMessage = resolutionMessage.trim();
    }

    // Save changes
    const updatedComplaint = await complaint.save();

    console.log(
      `Complaint ${updatedComplaint.id} updated to ${updatedComplaint.status}`
    );

    res.json({
      message: "Complaint updated successfully.",
      complaint: updatedComplaint,
    });

  } catch (error) {
    console.error("Error updating complaint:", error);

    res.status(500).json({
      message: "Failed to update complaint.",
    });
  }
});

// =========================
// MONGODB CONNECTION
// =========================

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
  });