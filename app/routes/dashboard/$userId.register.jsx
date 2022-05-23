import React from 'react'
import CloudinaryBtn from '../../components/ui/CloudinaryBtn'
import { getUser } from '~/utils/session.server'
import { Form, useLoaderData, useParams } from 'remix'
import {AdvancedImage} from '@cloudinary/react';
import {Cloudinary} from "@cloudinary/url-gen";
import {fill} from "@cloudinary/url-gen/actions/resize";
import {thumbnail} from "@cloudinary/url-gen/actions/resize";
import {byRadius} from "@cloudinary/url-gen/actions/roundCorners";
import {focusOn} from "@cloudinary/url-gen/qualifiers/gravity";
import {FocusOn} from "@cloudinary/url-gen/qualifiers/focusOn";
import { db } from '~/utils/db.server'
import { redirect } from '@remix-run/node';



export const loader = async ({ request, params }) => {
  const user = await getUser(request)
  let pictures = getPictures()
  
  const data = [
    user, 
    pictures.then(res => {
  
      const imageArray = res.resources
      let dp = imageArray[0].public_id
      return dp
    })
  ]
  return data
}

export const action = async ({ request, params }) => {
  const form = await request.formData()
  const pictureIdStr = form.get('picture-id')
  const pictureId = parseInt(pictureIdStr) 
  const user = await db.user.update({
    where: { id: params.userId },
      data: {
       picture: pictureId,
      },
  })

  return redirect(`/dashboard/${params.userId}/register`)
};

// export async function getPictures() {
//   const url = 'https://res.cloudinary.com/df7rg1mde/image/list/profile-picture.json'
//   let res = await fetch(url);
//   return res;
// }

export async function getPictures() {
  const res = await fetch(
    'https://res.cloudinary.com/df7rg1mde/image/list/profile-picture.json'
  ).then((res) => res.json());

  return res;
}

const changeDp = (dp) => {
  const cld = new Cloudinary({
    cloud: {
      cloudName: `df7rg1mde`,
    }
  });

  const myImage = cld.image(dp)
  console.log(dp)
  return (<AdvancedImage cldImg={myImage} /> )
}

export default function profileRegister(params) {



  let pictures = getPictures()  
  pictures.then(res => {

    const imageArray = res.resources
    let dp = imageArray[0].public_id
    changeDp(dp)
  })

  const userParams = useParams()
  const data = useLoaderData()
  console.log('look below')
  console.log(data[1])

  
  // console.log(user.picture)

  // const myImage = cld.image(`strength-tracker/${user.id}-dp-${user.picture}`)
  // console.log(user.picture)
  // myImage
  // .resize(thumbnail().width(150).height(150)) 

  // const cloudinaryData = [user.id, (user.picture +1 )]

  return (
    <>
      <div>profileRegister</div>
      {/* <CloudinaryBtn dataParentToChild={user.id} />  */}
      {/* {changeDp()} */}
      <Form action="" method="post">
        {/* <input type='hidden' value={user.picture + 1} name='picture-id'></input> */}
        {/* <CloudinaryBtn dataParentToChild={cloudinaryData}>Update profile picture</CloudinaryBtn> */}
      </Form>
    </>
  )
}


