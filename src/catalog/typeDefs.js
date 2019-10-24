export const catalogTypeDef = `
type Producto {
	catalog: Catalogo
	_id: String!
}

input ProductoInput {
	catalog: CatalogoInput
}

type Catalogo{

	_id: String
	vehiculos: Vehiculos
	telefonosTablets: TelefonosTablets
	computadores: Computadores
	electrodomesticos: Electrodomesticos
	empleos: Empleos
	servicios: Servicios
}
type Vehiculos{
	motos: Motos
	carros: Carros
}
type Carros{
	marca: String
	anio: Int
	kilometraje: Int
	combustible: String
	color: String
	transmision: String
	placa: String
	precio: Precio
}
type Motos{
	marca: String
	anio: Int
	kilometraje: Int
	color: String
	cilindrada: String
	tipoVendedor: String
	precio: Precio
}
type TelefonosTablets{
	telefonos: Telefono
	tablets: Tablet
}
type Telefono{
	marca: String
	precio: Precio
}
type Tablet{
	marca: String
	precio: Precio
}
type Computadores{
	computadorEscritorio: ComputadorEscritorio
	portatiles: Portatiles
}
type ComputadorEscritorio{
	precio: Precio
} 
type Portatiles{
	marca: String
	precio: Precio
}
type Electrodomesticos{
	cocinas: Cocina
	neveras: Nevera
}
type Cocina{
	tipo: String
	precio: Precio
}
type Nevera{
	precio: Precio
}
type Precio{
	valorPrecio: Float
	tipoPago: String
}
type Empleos{
	buscarTrabajo: BuscarTrabajo
}
type  BuscarTrabajo{
	tipo: String
	enEsteAnuncio: String
	nombreCompania: String
	experienciaMin:Int
	experienciaMax:Int
	salarioMin:Int
	salarioMax:Int
}
type  Servicios{
	clasesCursos: ClasesCursos
	reparaciones: Reparaciones
	transporteMudanza: TransporteMudanza
}
type  ClasesCursos{
    tipo: String
}
type  Reparaciones{
    tipo: String
}
type  TransporteMudanza{
    tipo: String
}
input CatalogoInput{
	
	vehiculos: VehiculosInput
	telefonosTablets: TelefonosTabletsInput
	computadores: ComputadoresInput
	electrodomesticos: ElectrodomesticosInput
	empleos: EmpleosInput
	servicios: ServiciosInput
}
input VehiculosInput{
	motos: MotosInput
	carros: CarrosInput
}
input CarrosInput{
	marca: String
	anio: Int
	kilometraje: Int
	combustible: String
	color: String
	transmision: String
	placa: String
	precio: PrecioInput
}
input MotosInput{
	marca: String
	anio: Int
	kilometraje: Int
	color: String
	cilindrada: String
	tipoVendedor: String
	precio: PrecioInput
}
input TelefonosTabletsInput{
	telefonos: TelefonoInput
	tablets: TabletInput
}
input TelefonoInput{
	marca: String
	precio: PrecioInput
}
input TabletInput{
	marca: String
	precio: PrecioInput
}
input ComputadoresInput{
	computadorEscritorio: ComputadorEscritorioInput
	portatiles: PortatilesInput
}
input ComputadorEscritorioInput{
	precio: PrecioInput
} 
input PortatilesInput{
	marca: String
	precio: PrecioInput
}
input ElectrodomesticosInput{
	cocinas: CocinaInput
	neveras: NeveraInput
}
input CocinaInput{
	tipo: String
	precio: PrecioInput
}
input NeveraInput{
	precio: PrecioInput
}
input PrecioInput{
	valorPrecio: Float
	tipoPago: String
}
input EmpleosInput{
	buscarTrabajo: BuscarTrabajoInput
}
input  BuscarTrabajoInput{
	tipo: String
	enEsteAnuncio: String
	nombreCompania: String
	experienciaMin:Int
	experienciaMax:Int
	salarioMin:Int
	salarioMax:Int
}
input  ServiciosInput{
	clasesCursos: ClasesCursosInput
	reparaciones: ReparacionesInput
	transporteMudanza: TransporteMudanzaInput
}
input  ClasesCursosInput{
    tipo: String
}
input  ReparacionesInput{
    tipo: String
}
input  TransporteMudanzaInput{
    tipo: String
}
`;

export const catalogQueries = `
	allCatalogs: [Producto]!
`;

export const catalogMutations = `
    createCatalog(catalogo: ProductoInput!): Producto!
    deleteCatalog(id: String!): Boolean
    updateCatalog(id: String!, catalogo: ProductoInput!): Boolean
`;
