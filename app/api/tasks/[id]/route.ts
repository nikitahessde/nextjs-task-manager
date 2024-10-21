import dbConnect from '../../../../utils/mongodb';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import Task from '../../../../models/Task';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const body = await req.json();
    try {
        const updatedTask = await Task.findOneAndUpdate({ uuid: params.id }, body, { new: true });
        if (!updatedTask) {
            return NextResponse.json({ message: 'Task not found' }, { status: 404 });
        }
        return NextResponse.json(updatedTask);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        await Task.findOneAndDelete({ uuid: params.id });
        return NextResponse.json({ message: 'Task deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}
