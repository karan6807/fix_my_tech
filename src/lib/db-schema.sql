-- Create table for repair proof images
CREATE TABLE repair_proof_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repair_completion_id UUID NOT NULL REFERENCES repair_completion_reports(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_key TEXT NOT NULL, -- S3 object key
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_repair_proof_images_completion_id ON repair_proof_images(repair_completion_id);
CREATE INDEX idx_repair_proof_images_created_at ON repair_proof_images(created_at);