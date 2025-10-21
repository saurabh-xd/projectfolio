import connectdb from "@/lib/dbconnect";
import ProjectModel from "@/models/Project";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ projectId: string }> }){
    try {
        await connectdb();
        const {projectId} = await params;
        const project = await ProjectModel.findById(projectId)

          if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
    
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}