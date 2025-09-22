// Helper function to create a signature-only version
export function createSignatureOverlay(signatureImage: string): Promise<string | null> {
    if (!signatureImage) return Promise.resolve(null);

    return new Promise((resolve) => {
        // This simulates preparing a signature overlay
        // In a real implementation, we wouldn't use this approach
        // Instead, we'd use pdf-lib to directly modify the PDF

        // For now, we'll just return the signature image directly
        resolve(signatureImage);
    });
}
