const logger = require("../../loaders/logger");
const LIBRARY_URL = "http://digitallibrary.usc.edu/digital"
const https = require('http')
var request = require('request').defaults({ encoding: null });
var fs = require('fs');
const libService = require("../../services/LibraryService");
const getLibraryApi = async (req, res) => {
    try {
        https.get(`${LIBRARY_URL}/api/search/searchterm/Mattie%20Mcglothen/page/${req.query.page}/maxRecords/${req.query.limit}`, (resp) => {
            let data = '';
            var promises = []
            var itms
            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                itms = JSON.parse(data).items
                itms.forEach(element => {
                    promises.push(
                        new Promise((resolve, reject) => {
                            request.get(`${LIBRARY_URL}${element.thumbnailUri}`, function (error, response, body) {
                                if (error) reject(error)

                                if (!error && response.statusCode == 200) {
                                    _data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
                                    //console.log(data);
                                    element.thumbnailUri = _data
                                    resolve()
                                }
                            });
                        })
                    )

                })
                Promise.all(promises).then(() => {
                    var _data = JSON.parse(data)
                    _data.items = itms;
                    res.send(_data);
                }).catch(err => err)
            });

        }).on("error", (err) => {
            logger.error(err)
            return { success: false, msg: err.message }
        });
    }
    catch (err) {
        logger.error(err)
    }
}
const getLibraryDetail = async (req, res) => {
    try {
        https.get(`${LIBRARY_URL}/api/collections/${req.query.coll_alias}/items/${req.query.book_id}/false`, (resp) => {
            let data = '';
            let promises = []
            let _childerns
            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                _childerns = JSON.parse(data).parent.children.slice(0, 60)
                _childerns.forEach(element => {
                    promises.push(
                        new Promise((resolve, reject) => {
                            request.get(`${LIBRARY_URL}${element.thumbnailUri}`, function (error, response, body) {
                                if (error) {
                                    reject(error)
                                }

                                if (!error && response.statusCode == 200) {
                                    _data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
                                    //console.log(data);
                                    element.thumbnailUri = _data
                                    resolve()
                                }
                            });
                        })
                    )

                })
                Promise.all(promises).then(() => {
                    var _data = JSON.parse(data)
                    _data.parent.children = _childerns;
                    request.get(`${LIBRARY_URL}${_data.imageUri}`, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
                            _data.imageUri = data
                            res.send(_data);
                        }
                    })

                }).catch(err => logger.error(err))
            });

        }).on("error", (err) => {
            logger.error(err)
            return { success: false, msg: err.message }
        });
    }
    catch (err) {
        logger.error(err)
    }
}
const libraryList = async (req, res) => {
    try {
        let data = [];
        data = await libService.getLibraryList(req.query);
        if (data.library.length > 0) {
            data.library.forEach((obj) => {
                obj.documents = obj.documents[obj.documents.length - 1]
            })
            return res.json({
                success: true,
                successResponse: data
            });
        } else {
            return res.json({
                success: false,
                msg: "Library list not found"
            });
        }
    } catch (err) {
        logger.error(err)
    }
}
const getLibrary = async (req, res) => {
    try {
        let library = null;
        library = await libService.getLibById(req.params.lib_id)
        console.log("library", library)
        if (library) {
            return res.json({
                success: true,
                successResponse: library
            });
        } else {
            return res.json({
                success: false,
                msg: "library Detail not found"
            });
        }
    }
    catch (err) {
        logger.error(err)
    }
}

const downloadImage = async (req, res) => {
    try {
        download(`${LIBRARY_URL}/download/collection/${req.query.alias}/id/${req.query.id}/size/large`, function (filePath, fileName) {
            res.download(filePath, fileName, function () {
                fs.unlinkSync(filePath)
            })
        })
    }
    catch (err) {
        logger.error(err)
    }

}

var download = function (uri, callback) {
    request.head(uri, function (err, res, body) {
        //   console.log('content-type:', res.headers['content-type']);
        //   console.log('content-length:', res.headers['content-length']);
        var filename = "";
        var disposition = res.headers['content-disposition'];
        if (disposition && disposition.indexOf('attachment') !== -1) {
            var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            var matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }
        request(uri).pipe(fs.createWriteStream(`public/uploads/libraryImages/${filename}`)).on('close', function () { callback(`public/uploads/libraryImages/${filename}`, filename) });
    });
};

module.exports = {
    getLibraryApi,
    getLibraryDetail,
    libraryList,
    getLibrary,
    downloadImage
}