import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Tablerow from "@mui/material/Tablerow";
import Paper from "@mui/material/Paper";
import { OneRmEstimate } from "../routes/dashboard/$exerciseId";

export default function BasicTable({ prs }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <Tablerow>
            <TableCell>Weight</TableCell>
            <TableCell>Reps</TableCell>
            <TableCell>Projected 1rm</TableCell>
            <TableCell>Date</TableCell>
          </Tablerow>
        </TableHead>
        <TableBody>
          {prs.map((pr) => (
            <Tablerow
              key={pr.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{pr.weight}</TableCell>
              <TableCell>{pr.reps}</TableCell>
              <TableCell>{OneRmEstimate(pr.weight, pr.reps)}</TableCell>
              <TableCell>{new Date(pr.createdAt).toLocaleString()}</TableCell>
            </Tablerow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
