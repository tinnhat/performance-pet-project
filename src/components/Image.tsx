import React from "react";

function ImageCus({ avatar_url, name }: { avatar_url: string; name: string } ) {
  return <img className='avatar' src={avatar_url} alt={name} loading="lazy" />
}

ImageCus.propTypes = {}

export default React.memo(ImageCus)
