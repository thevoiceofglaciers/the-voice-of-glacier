( function ( blocks, element, blockEditor, components ) {
	var el = element.createElement;
	var registerBlockType = blocks.registerBlockType;
	var useBlockProps = blockEditor.useBlockProps;
	var TextareaControl = components.TextareaControl;
	var Button = components.Button;

	function pad( n ) {
		return ( n < 10 ? '0' : '' ) + n;
	}

	function renderPreview( items, rootProps ) {
		return el(
			'div',
			rootProps || { className: 'tvgf-takeaways-grid' },
			items.map( function ( item, index ) {
				return el(
					'div',
					{ key: index, className: 'tvgf-takeaway' },
					el( 'div', { className: 'tvgf-takeaway-number' }, pad( index + 1 ) ),
					el( 'p', {}, item.text )
				);
			} )
		);
	}

	registerBlockType( 'tvgf/takeaways', {
		edit: function ( props ) {
			var items = props.attributes.items || [];
			var setAttributes = props.setAttributes;
			var blockProps = useBlockProps( { className: 'tvgf-takeaways-edit' } );

			return el(
				'div',
				blockProps,
				el( 'p', { className: 'tvgf-block-label' }, 'Takeaways — preview' ),
				renderPreview( items ),
				el( 'p', { className: 'tvgf-block-label' }, 'Edit takeaways' ),
				items.map( function ( item, index ) {
					return el(
						'div',
						{ key: index, className: 'tvgf-takeaway-row' },
						el( TextareaControl, {
							label: 'Takeaway ' + pad( index + 1 ),
							value: item.text || '',
							onChange: function ( v ) {
								var next = items.slice();
								next[ index ] = Object.assign( {}, next[ index ], { text: v } );
								setAttributes( { items: next } );
							},
						} ),
						el(
							Button,
							{
								isDestructive: true,
								variant: 'secondary',
								onClick: function () {
									var next = items.slice();
									next.splice( index, 1 );
									setAttributes( { items: next } );
								},
							},
							'Remove'
						)
					);
				} ),
				el(
					Button,
					{
						variant: 'primary',
						onClick: function () {
							setAttributes( { items: items.concat( [ { text: '' } ] ) } );
						},
					},
					'+ Add takeaway'
				)
			);
		},
		save: function ( props ) {
			var blockProps = blockEditor.useBlockProps.save( { className: 'tvgf-takeaways-grid' } );
			return renderPreview( props.attributes.items || [], blockProps );
		},
	} );
} )( window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components );
