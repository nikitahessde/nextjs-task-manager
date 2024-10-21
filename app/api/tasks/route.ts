import dbConnect from '../../../utils/mongodb';
import Task from '../../../models/Task';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
    await dbConnect();
    const body = await req.json();
    const task = new Task(body);
    try {
        const savedTask = await task.save();
        console.log('Task saved:', savedTask);
        return NextResponse.json(savedTask);
    } catch (error: any) {
        console.error('Error saving task:', error);
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}

export async function GET(req: NextRequest, res: NextResponse) {
    await dbConnect();
    try {
        const tasks = await Task.find();
        return NextResponse.json(tasks);
    } catch (error: any) {
        console.error('Error fetching tasks:', error);
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}