import mongoose from "mongoose";
import { GET } from "./route";
import Task from "../../../models/Task";
import Group from "../../../models/Group";
import * as nextAuth from "next-auth";
import dbConnect from "../../../utils/mongodb";

const mockData = {
  groups: [{ uuid: "group1", name: "Group 1", users: ["developer@example.com"] }],
  tasks: [
    {
      uuid: "task1",
      name: "Task 1",
      description: "Description 1",
      status: "open",
      assignedTo: "developer@example.com",
      assignedGroup: "group1",
    },
    {
      uuid: "task2",
      name: "Task 2",
      description: "Description 2",
      status: "closed",
      assignedTo: "manager@example.com",
    },
  ],
};

const insertMockData = async () => {
  await Group.insertMany(mockData.groups);
  await Task.insertMany(mockData.tasks);
};

beforeAll(async () => {
  await dbConnect();
  await insertMockData();
});

afterAll(async () => {
  await mongoose.connection.close();
});

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

describe("Group-Based Access Control", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.setTimeout(20000);
  });

  it("should return tasks for a developer - only tasks that are assigned to his group", async () => {
    (nextAuth.getServerSession as jest.Mock).mockResolvedValue({
      user: {
        email: "developer@example.com",
        roles: ["developer"],
      },
    });

    const response = await GET();
    const responseData = await response.json();

    expect(responseData).toEqual([mockData.tasks[0]]);
  });

  it("should return all tasks for a non-developer", async () => {
    (nextAuth.getServerSession as jest.Mock).mockResolvedValue({
      user: {
        email: "manager@example.com",
        roles: ["manager"],
      },
    });

    const response = await GET();
    const responseData = await response.json();

    expect(responseData).toEqual(mockData.tasks);
  });
});
