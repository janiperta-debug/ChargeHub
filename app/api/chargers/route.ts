export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const latitude = searchParams.get("latitude")
  const longitude = searchParams.get("longitude")
  const radius = searchParams.get("radius") || "10"

  console.log("API Request received:", { latitude, longitude, radius })

  if (!latitude || !longitude) {
    console.log("Missing coordinates, returning error")
    return Response.json({ error: "Missing latitude or longitude" }, { status: 400 })
  }

  const lat = Number.parseFloat(latitude)
  const lng = Number.parseFloat(longitude)

  console.log("Parsed coordinates:", { lat, lng })

  // Determine which area we're looking for based on coordinates
  const isHelsinkiArea = lat < 60.9 && lng > 24.0 && lng < 25.5 // Expanded to cover southern Finland including Hyvinkää
  const isHämeenlinnaArea = lat >= 60.9 && lat < 61.2 && lng > 24.3 && lng < 24.7

  console.log("Area detection:", {
    isHelsinkiArea,
    isHämeenlinnaArea,
    latCheck: { lessThan60_9: lat < 60.9, between60_9_61_2: lat >= 60.9 && lat < 61.2 },
    lngCheck: { helsinkiRange: lng > 24.0 && lng < 25.5, hämeenlinnaRange: lng > 24.3 && lng < 24.7 },
  })

  let mockData = []

  if (isHelsinkiArea) {
    console.log("Using Helsinki mock data")
    // Helsinki area mock data for fallback (covers southern Finland including Hyvinkää)
    mockData = [
      {
        ID: 101,
        Title: "Helsinki Kamppi",
        AddressInfo: {
          Title: "Helsinki Kamppi",
          AddressLine1: "Urho Kekkosen katu 1",
          Town: "Helsinki",
          Postcode: "00100",
          Latitude: 60.1699,
          Longitude: 24.9384,
          Country: { Title: "Finland" },
        },
        OperatorInfo: { Title: "Helen" },
        Connections: [{ PowerKW: 22, Quantity: 4, ConnectionType: { Title: "Type 2" } }],
        StatusType: { Title: "Operational" },
      },
      {
        ID: 102,
        Title: "Virta Helsinki Keskusta",
        AddressInfo: {
          Title: "Virta Helsinki Keskusta",
          AddressLine1: "Mannerheimintie 12",
          Town: "Helsinki",
          Postcode: "00100",
          Latitude: 60.1695,
          Longitude: 24.9354,
          Country: { Title: "Finland" },
        },
        OperatorInfo: { Title: "Virta" },
        Connections: [{ PowerKW: 150, Quantity: 2, ConnectionType: { Title: "CCS" } }],
        StatusType: { Title: "Operational" },
      },
      {
        ID: 103,
        Title: "K-Lataus Hyvinkää",
        AddressInfo: {
          Title: "K-Lataus Hyvinkää",
          AddressLine1: "Hämeenkatu 15",
          Town: "Hyvinkää",
          Postcode: "05800",
          Latitude: 60.6105,
          Longitude: 24.87,
          Country: { Title: "Finland" },
        },
        OperatorInfo: { Title: "K-Lataus" },
        Connections: [{ PowerKW: 50, Quantity: 3, ConnectionType: { Title: "CCS" } }],
        StatusType: { Title: "Operational" },
      },
      {
        ID: 104,
        Title: "ABC Hyvinkää",
        AddressInfo: {
          Title: "ABC Hyvinkää",
          AddressLine1: "Torikatu 8",
          Town: "Hyvinkää",
          Postcode: "05800",
          Latitude: 60.6089,
          Longitude: 24.8654,
          Country: { Title: "Finland" },
        },
        OperatorInfo: { Title: "ABC Lataus" },
        Connections: [{ PowerKW: 75, Quantity: 2, ConnectionType: { Title: "CCS" } }],
        StatusType: { Title: "Operational" },
      },
    ]
  } else if (isHämeenlinnaArea) {
    console.log("Using Hämeenlinna mock data")
    // Hämeenlinna area mock data
    mockData = [
      {
        ID: 1,
        Title: "Hämeenlinna K-Citymarket",
        AddressInfo: {
          Title: "Hämeenlinna K-Citymarket",
          AddressLine1: "Parolantie 54",
          Town: "Hämeenlinna",
          Postcode: "13130",
          Latitude: 60.9967,
          Longitude: 24.4642,
          Country: { Title: "Finland" },
        },
        OperatorInfo: { Title: "K-Lataus" },
        Connections: [{ PowerKW: 22, Quantity: 2, ConnectionType: { Title: "Type 2" } }],
        StatusType: { Title: "Operational" },
      },
      {
        ID: 2,
        Title: "ABC Hämeenlinna",
        AddressInfo: {
          Title: "ABC Hämeenlinna",
          AddressLine1: "Tampereentie 16",
          Town: "Hämeenlinna",
          Postcode: "13100",
          Latitude: 60.9945,
          Longitude: 24.4598,
          Country: { Title: "Finland" },
        },
        OperatorInfo: { Title: "ABC Lataus" },
        Connections: [{ PowerKW: 50, Quantity: 1, ConnectionType: { Title: "CCS" } }],
        StatusType: { Title: "Operational" },
      },
      {
        ID: 3,
        Title: "Virta Hämeenlinna Keskusta",
        AddressInfo: {
          Title: "Virta Hämeenlinna Keskusta",
          AddressLine1: "Raatihuoneenkatu 1",
          Town: "Hämeenlinna",
          Postcode: "13100",
          Latitude: 60.9967,
          Longitude: 24.4642,
          Country: { Title: "Finland" },
        },
        OperatorInfo: { Title: "Virta" },
        Connections: [{ PowerKW: 150, Quantity: 2, ConnectionType: { Title: "CCS" } }],
        StatusType: { Title: "Operational" },
      },
      {
        ID: 4,
        Title: "Helen Hämeenlinna",
        AddressInfo: {
          Title: "Helen Hämeenlinna",
          AddressLine1: "Kasarmikatu 12",
          Town: "Hämeenlinna",
          Postcode: "13100",
          Latitude: 60.9978,
          Longitude: 24.4655,
          Country: { Title: "Finland" },
        },
        OperatorInfo: { Title: "Helen" },
        Connections: [{ PowerKW: 22, Quantity: 1, ConnectionType: { Title: "Type 2" } }],
        StatusType: { Title: "Operational" },
      },
      {
        ID: 5,
        Title: "Fortum Hämeenlinna Asema",
        AddressInfo: {
          Title: "Fortum Hämeenlinna Asema",
          AddressLine1: "Rautatienkatu 22",
          Town: "Hämeenlinna",
          Postcode: "13100",
          Latitude: 60.9989,
          Longitude: 24.4612,
          Country: { Title: "Finland" },
        },
        OperatorInfo: { Title: "Recharge" },
        Connections: [{ PowerKW: 75, Quantity: 2, ConnectionType: { Title: "CCS" } }],
        StatusType: { Title: "Operational" },
      },
    ]
  } else {
    console.log("Using default Finnish charging stations for unmatched coordinates")
    mockData = [
      {
        ID: 201,
        Title: "Virta Yleinen Latauspiste",
        AddressInfo: {
          Title: "Virta Yleinen Latauspiste",
          AddressLine1: "Keskuskatu 1",
          Town: "Suomi",
          Postcode: "00000",
          Latitude: lat,
          Longitude: lng,
          Country: { Title: "Finland" },
        },
        OperatorInfo: { Title: "Virta" },
        Connections: [{ PowerKW: 50, Quantity: 2, ConnectionType: { Title: "CCS" } }],
        StatusType: { Title: "Operational" },
      },
      {
        ID: 202,
        Title: "K-Lataus Yleinen",
        AddressInfo: {
          Title: "K-Lataus Yleinen",
          AddressLine1: "Kauppakatu 5",
          Town: "Suomi",
          Postcode: "00000",
          Latitude: lat + 0.001,
          Longitude: lng + 0.001,
          Country: { Title: "Finland" },
        },
        OperatorInfo: { Title: "K-Lataus" },
        Connections: [{ PowerKW: 22, Quantity: 1, ConnectionType: { Title: "Type 2" } }],
        StatusType: { Title: "Operational" },
      },
    ]
  }

  console.log(`Returning ${mockData.length} charging stations`)
  return Response.json(mockData)
}
