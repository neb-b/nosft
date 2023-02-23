import React from "react"
import Card from "react-bootstrap/Card"
import { TailSpin } from "react-loading-icons"

function ordinalsImageUrl(utxo) {
  if (!utxo) return ""
  return `https://ordinals.com/content/${utxo.txid}i${utxo.vout}`
}

function cloudfrontUrl(utxo) {
  if (!utxo) return ""
  return `https://d2v3k2do8kym1f.cloudfront.net/minted-items/${utxo.txid}:${utxo.vout}`
}

export const UTXO = ({ utxo, inscriptionUtxosByUtxo }) => {
  const [type, setType] = React.useState("")
  const [text, setText] = React.useState("")

  const url = utxo.status.confirmed
    ? ordinalsImageUrl(inscriptionUtxosByUtxo[`${utxo.txid}:${utxo.vout}`])
    : cloudfrontUrl(utxo)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url)
        const contentType = response.headers.get("content-type")
        const isText = contentType && contentType.includes("text/plain")

        if (isText) {
          const data = await response.text()
          setText(data)
        }

        setType(isText ? "text" : "img")
      } catch (e) {
        setType("img")
      }
    }

    fetchData()
  }, [url])

  return (
    <Card className="my-2 mx-2 hover-pointer gallery-item">
      <Card.Body
        className="d-flex flex-column"
        onClick={() => {
          setCurrentUtxo(utxo)
          setShowUtxoModal(true)
        }}
      >
        {!inscriptionUtxosByUtxo[`${utxo.txid}:${utxo.vout}`] ? (
          <>
            <br />
            <br />
            <TailSpin stroke="#000000" speed={0.75} />
            <br />
            <br />
          </>
        ) : (
          <>
            {type === "img" && <img alt="" src={url} style={{ width: "200px" }} className="mb-3" />}
            {type === "text" && <p className="mb-3">{text}</p>}
          </>
        )}
      </Card.Body>
    </Card>
  )
}
