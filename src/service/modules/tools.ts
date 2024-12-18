import { aiRequest, pluginRequest } from '@/service'

const apiGetTools = () => {
  return aiRequest.post({
    url: '/execute',
    headers: { 'api-key': 'a9e9b0a308402178786cd2146788103a493c7118b595015e56ed482bceea0ca4' },
    data: {
      name: 'info_data',
      func: 'post_guess_all',
      args: {
        db: 'msg_relation',
        guess: {},
        origin: true,
      },
    },
  })

}

const apiUploadBinary = (content: string, filename: string) => {
  return pluginRequest.post({
    url: '/execute',
    data: {
      name: 'file_upload',
      func: "post_upload_binary",
      args: {
        content: content,
        filename: filename,
      }
    }
  })
}

const apiDownloadBinary = (filename: string) => {
  return pluginRequest.post({
    url: '/execute',
    data: {
      name: 'file_upload',
      func: "post_down_binary",
      args: {
        filename: filename,
      }
    }
  })
}


const apiTransi2i = (inpath: string, ext: string) => {
  return pluginRequest.post({
    url: '/execute',
    data: {
      name: 'aigc_image',
      func: "post_trans_i2i",
      args: {
        inpath: inpath,
        ext: ext,
      }
    }
  })
}

const apiTransv2v = () => {
  return pluginRequest.post({
    url: '/execute',
    data: {
      name: 'aigc_image',
      func: "post_trans_v2v",
      args: {
        inpath: '"C:/Users/ver/Desktop/图片  1/output.png"',
        ext: '.png',
      }
    }
  })
}

const apiTransa2a = () => {
  return pluginRequest.post({
    url: '/execute',
    data: {
      name: 'aigc_image',
      func: "post_trans_v2v",
      args: {
        inpath: '"C:/Users/ver/Desktop/图片  1/output.png"',
        ext: '.png',
      }
    }
  })
}

const apiRemoveBgi = () => {
  return pluginRequest.post({
    url: '/execute',
    data: {

    }
  })
}

const apiRenameVideo = () => {
  return pluginRequest.post({
    url: '/execute',
    data: {
      name: 'aigc_image',

    }
  })
}

const apiRenameAudio = () => {
  return pluginRequest.post({
    url: '/execute',
    data: {
      name: 'aigc_image',

    }
  })
}

export { apiDownloadBinary, apiGetTools, apiTransi2i, apiTransv2v, apiTransa2a, apiRemoveBgi, apiRenameVideo, apiRenameAudio, apiUploadBinary }
