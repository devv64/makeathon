/* eslint-disable react/no-unescaped-entities */

import { useState } from "react";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { lighten } from "@mui/material/styles";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import data from "layouts/dashboard/components/Projects/data";

function Projects() {
  const { columns, rows } = data();
  const [menu, setMenu] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState(null);
  const [doctorComment, setDoctorComment] = useState("");

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  const openCommentDialog = (logId) => {
    setSelectedLogId(logId);
    setOpenDialog(true);
  };

  const closeCommentDialog = () => {
    setOpenDialog(false);
    setDoctorComment("");
  };

  const handleCommentChange = (event) => {
    setDoctorComment(event.target.value);
  };

  const handleCommentSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:8000/log/${selectedLogId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: doctorComment,
          doctor: "Dr. John Doe", // Assuming a static doctor name for now
        }),
      });
      const result = await response.json();
      if (response.ok) {
        // Handle the successful addition of the comment here
        console.log("Comment added:", result);
      } else {
        console.error("Error adding comment:", result.error);
      }
      closeCommentDialog();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={closeMenu}>Action</MenuItem>
      <MenuItem onClick={closeMenu}>Another action</MenuItem>
      <MenuItem onClick={closeMenu}>Something else</MenuItem>
    </Menu>
  );

  // Function to split comments and render newlines
  const renderCommentWithNewlines = (comment) => {
    return comment.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <Card sx={{ borderRadius: "15px", boxShadow: 3 }}>
      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={3}
        sx={{
          backgroundColor: "rgb(6, 93, 42)",
          borderTopLeftRadius: "15px",
          borderTopRightRadius: "15px",
        }}
      >
        <MDBox>
          <MDTypography variant="h6" gutterBottom color="white">
            Patient Reports
          </MDTypography>
          <MDBox display="flex" alignItems="center" lineHeight={0}>
            <Icon
              sx={{
                fontWeight: "bold",
                color: ({ palette: { info } }) => lighten(info.main, 0.2),
                mt: -0.5,
              }}
            >
              done
            </Icon>
            <MDTypography variant="button" fontWeight="regular" color="white">
              &nbsp;<strong>30 done</strong> this month
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox color="text" px={2}>
          <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={openMenu}>
            more_vert
          </Icon>
        </MDBox>
        {renderMenu}
      </MDBox>
      <MDBox>
        <DataTable
          table={{
            columns,
            rows: rows.map((row) => ({
              ...row,
              action: (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => openCommentDialog(row._id)}
                >
                  Add Comment
                </Button>
              ),
            })),
            styles: {
              root: {
                borderBottom: "2px solid #ddd",
              },
              cell: {
                padding: "12px",
              },
              header: {
                backgroundColor: (theme) => lighten(theme.palette.primary.main, 0.6),
                color: "#fff",
                fontWeight: "bold",
              },
              bodyRow: {
                "&:hover": {
                  backgroundColor: "#f4f6f9",
                },
              },
            },
          }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
      </MDBox>

      <Dialog open={openDialog} onClose={closeCommentDialog}>
        <DialogTitle>Add Doctor's Comment</DialogTitle>
        <DialogContent>
          <TextField
            label="Comment"
            multiline
            fullWidth
            rows={4}
            value={doctorComment}
            onChange={handleCommentChange}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCommentDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCommentSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* To display the doctor's comment with newlines */}
      <MDBox mt={3}>
        <MDTypography style={{ whiteSpace: "pre-wrap" }}>
          {renderCommentWithNewlines(doctorComment)}
        </MDTypography>
      </MDBox>
    </Card>
  );
}

export default Projects;
