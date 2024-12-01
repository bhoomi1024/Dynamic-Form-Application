import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Container,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// API Responses (unchanged)
const apiResponses = {
  userInformation: {
    fields: [
      { name: "firstName", type: "text", label: "First Name", required: true },
      { name: "lastName", type: "text", label: "Last Name", required: true },
      { name: "age", type: "number", label: "Age", required: false },
    ],
  },
  addressInformation: {
    fields: [
      { name: "street", type: "text", label: "Street", required: true },
      { name: "city", type: "text", label: "City", required: true },
      { name: "state", type: "dropdown", label: "State", options: ["California", "Texas", "New York"], required: true },
      { name: "zipCode", type: "text", label: "Zip Code", required: false },
    ],
  },
  paymentInformation: {
    fields: [
      { name: "cardNumber", type: "text", label: "Card Number", required: true },
      { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
      { name: "cvv", type: "password", label: "CVV", required: true },
      { name: "cardholderName", type: "text", label: "Cardholder Name", required: true },
    ],
  },
};

const DynamicForm = () => {
  const [formType, setFormType] = useState("userInformation");
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState({
    userInformation: [],
    addressInformation: [],
    paymentInformation: [],
  });
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleFormTypeChange = (event) => {
    setFormType(event.target.value);
    setFormData({});
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const updatedData = { ...submittedData };

    if (editIndex !== null) {
      updatedData[formType][editIndex] = formData;
      setSnackbarMessage("Changes saved successfully.");
      setEditIndex(null);
    } else {
      updatedData[formType].push(formData);
      setSnackbarMessage("Form submitted successfully.");
    }

    setSubmittedData(updatedData);
    setFormData({});
    setIsEditDialogOpen(false);
  };

  const handleEdit = (index) => {
    setFormData(submittedData[formType][index]);
    setEditIndex(index);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (index) => {
    const updatedData = { ...submittedData };
    updatedData[formType].splice(index, 1);
    setSubmittedData(updatedData);
    setSnackbarMessage("Entry deleted successfully.");
  };

  const renderFields = () => {
    const fields = apiResponses[formType].fields;

    return fields.map((field, index) => (
      <Box key={index} mb={2}>
        {field.type === "dropdown" ? (
          <FormControl fullWidth>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              fullWidth
            >
              {field.options.map((option, idx) => (
                <MenuItem key={idx} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <TextField
            fullWidth
            type={field.type}
            label={field.label}
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            variant="outlined"
          />
        )}
      </Box>
    ));
  };

  return (
    <Box sx={{ backgroundColor: "#f4f4f4", minHeight: "100vh", pb: 4 }}>
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: "#1E2A47" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ color: "#fff" }}>
            Dynamic Form Application
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Typography
          variant="h4"
          mb={3}
          textAlign="center"
          sx={{ fontWeight: 600, color: "#333" }}
        >
          Dynamic Form
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel sx={{ marginTop: '-9px' }}>Select Form Type</InputLabel>
          <Select
            value={formType}
            onChange={handleFormTypeChange}
            fullWidth
          >
            {Object.keys(apiResponses).map((type) => (
              <MenuItem key={type} value={type}>
                {type.replace(/([A-Z])/g, " $1")}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={() => setIsEditDialogOpen(true)}
          sx={{
            my: 2,
            backgroundColor: "#FFC107",
            color: "#333",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            "&:hover": {
              backgroundColor: "#FF9800",
            },
          }}
        >
          FILL {editIndex !== null ? "Edit" : "DETAILS"} 
        </Button>

        <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
          <DialogTitle sx={{ color: "#333" }}>
            {editIndex !== null ? "Edit Entry" : "New Entry"}
          </DialogTitle>
          <DialogContent>{renderFields()}</DialogContent>
          <DialogActions>
            <Button
              onClick={() => setIsEditDialogOpen(false)}
              sx={{ color: "#555" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{ backgroundColor: "#FFC107", color: "#333" }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Submitted Data Table */}
        <Box mt={4}>
          <Typography variant="h6" sx={{ color: "#333" }}>
            {formType.replace(/([A-Z])/g, " $1")} Data
          </Typography>
          {submittedData[formType].length > 0 ? (
            <TableContainer
              component={Paper}
              sx={{ mt: 2, border: "1px solid #ddd" }}
            >
              <Table>
                <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
                  <TableRow>
                    {Object.keys(submittedData[formType][0]).map((key) => (
                      <TableCell key={key} sx={{ fontWeight: 600 }}>
                        {key}
                      </TableCell>
                    ))}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submittedData[formType].map((data, index) => (
                    <TableRow key={index}>
                      {Object.values(data).map((value, idx) => (
                        <TableCell key={idx}>{value}</TableCell>
                      ))}
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(index)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography sx={{ color: "#333", mt: 2 }}>
              No entries found.
            </Typography>
          )}
        </Box>
      </Container>

      {/* Snackbar for success messages */}
      <Snackbar
        open={snackbarMessage !== ""}
        autoHideDuration={6000}
        onClose={() => setSnackbarMessage("")}
      >
        <Alert
          onClose={() => setSnackbarMessage("")}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DynamicForm;
