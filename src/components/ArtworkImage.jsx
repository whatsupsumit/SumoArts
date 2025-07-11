function ArtworkImage({ artwork }) {
  return (
    <img 
      src={artwork.imageUrl} // Base64 string works directly as src
      alt={artwork.title}
      className="w-full h-full object-cover rounded"
    />
  );
} 